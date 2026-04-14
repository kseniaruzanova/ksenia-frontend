<template>
  <div class="relative min-h-screen overflow-hidden bg-[#0a0612] text-white">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-violet-600/25 blur-[100px]" />
      <div class="absolute right-[-120px] top-1/4 h-[380px] w-[380px] rounded-full bg-fuchsia-500/20 blur-[90px]" />
      <div class="absolute bottom-0 left-1/2 h-[320px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[100px]" />
      <div
        class="absolute inset-0 opacity-[0.35]"
        style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0); background-size: 32px 32px;"
      />
    </div>

    <div class="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-16 sm:px-8">
      <div
        class="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10"
      >
        <slot />
      </div>
      <div v-if="$slots.footer" class="mt-8 text-center text-xs text-white/35">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
