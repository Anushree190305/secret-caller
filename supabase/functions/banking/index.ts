import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!
    ).auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, amount, recipient } = await req.json();

    if (!action) {
      return new Response(JSON.stringify({ error: "Action required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsedAmount = parseFloat(amount);
    if (
      (action === "deposit" || action === "withdraw" || action === "transfer") &&
      (!parsedAmount || parsedAmount <= 0)
    ) {
      return new Response(
        JSON.stringify({ error: "Valid positive amount required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get sender profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "deposit") {
      const newBalance = parseFloat(profile.balance) + parsedAmount;
      const newDeposited = parseFloat(profile.total_deposited) + parsedAmount;

      await supabase
        .from("profiles")
        .update({ balance: newBalance, total_deposited: newDeposited })
        .eq("user_id", user.id);

      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "deposit",
        amount: parsedAmount,
        status: "completed",
      });

      return new Response(
        JSON.stringify({ success: true, balance: newBalance }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (action === "withdraw") {
      if (parseFloat(profile.balance) < parsedAmount) {
        return new Response(
          JSON.stringify({ error: "Insufficient balance" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const newBalance = parseFloat(profile.balance) - parsedAmount;
      const newWithdrawn = parseFloat(profile.total_withdrawn) + parsedAmount;

      await supabase
        .from("profiles")
        .update({ balance: newBalance, total_withdrawn: newWithdrawn })
        .eq("user_id", user.id);

      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "withdraw",
        amount: parsedAmount,
        status: "completed",
      });

      return new Response(
        JSON.stringify({ success: true, balance: newBalance }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (action === "transfer") {
      if (!recipient) {
        return new Response(
          JSON.stringify({ error: "Recipient required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (parseFloat(profile.balance) < parsedAmount) {
        return new Response(
          JSON.stringify({ error: "Insufficient balance" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Find recipient by email or account number
      const { data: recipientProfile, error: recipientError } = await supabase
        .from("profiles")
        .select("*")
        .or(`email.eq.${recipient},account_number.eq.${recipient}`)
        .single();

      if (recipientError || !recipientProfile) {
        return new Response(
          JSON.stringify({ error: "Recipient not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (recipientProfile.user_id === user.id) {
        return new Response(
          JSON.stringify({ error: "Cannot transfer to yourself" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Deduct sender
      const senderNewBalance = parseFloat(profile.balance) - parsedAmount;
      const senderNewWithdrawn =
        parseFloat(profile.total_withdrawn) + parsedAmount;
      await supabase
        .from("profiles")
        .update({
          balance: senderNewBalance,
          total_withdrawn: senderNewWithdrawn,
        })
        .eq("user_id", user.id);

      // Credit recipient
      const recipientNewBalance =
        parseFloat(recipientProfile.balance) + parsedAmount;
      const recipientNewDeposited =
        parseFloat(recipientProfile.total_deposited) + parsedAmount;
      await supabase
        .from("profiles")
        .update({
          balance: recipientNewBalance,
          total_deposited: recipientNewDeposited,
        })
        .eq("user_id", recipientProfile.user_id);

      // Transaction for sender
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "transfer_sent",
        amount: parsedAmount,
        recipient_id: recipientProfile.user_id,
        recipient_info: recipientProfile.email,
        status: "completed",
      });

      // Transaction for recipient
      await supabase.from("transactions").insert({
        user_id: recipientProfile.user_id,
        type: "transfer_received",
        amount: parsedAmount,
        recipient_id: user.id,
        recipient_info: profile.email,
        status: "completed",
      });

      return new Response(
        JSON.stringify({ success: true, balance: senderNewBalance }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
